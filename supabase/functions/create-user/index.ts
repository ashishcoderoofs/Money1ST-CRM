
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  manager_id?: string;
  phone?: string;
  can_access_securia: boolean;
  has_access: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const userData: CreateUserRequest = await req.json();

    // Create the auth user with service role
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: "TempPass123!",
      email_confirm: true,
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name,
      }
    });

    if (authError) {
      console.error("Auth user creation error:", authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Failed to create user");
    }

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Handle manager_id properly - convert "no-manager" string to null
    const managerId = userData.manager_id === "no-manager" || !userData.manager_id ? null : userData.manager_id;

    // Update the profile with additional information, ensuring role is set correctly
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        role: userData.role, // Make sure the role from the form is used
        manager_id: managerId,
        phone: userData.phone,
        can_access_securia: userData.can_access_securia,
        has_access: userData.has_access,
      })
      .eq("id", authData.user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      // Don't throw here, as the user was still created
      // But log the issue for debugging
      console.error("Failed to update profile with role:", userData.role);
    }

    console.log("User created successfully with role:", userData.role);

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: authData.user,
        message: "User created successfully"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in create-user function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to create user",
        success: false
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
