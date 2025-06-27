
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create the admin user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@money1st.com',
      password: 'AdminPass123!',
      email_confirm: true,
      user_metadata: {
        first_name: 'System',
        last_name: 'Administrator'
      }
    })

    if (userError) {
      console.error('Error creating user:', userError)
      return new Response(
        JSON.stringify({ error: userError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Update the profile with admin role
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        role: 'Admin',
        status: 'Active',
        has_access: true,
        can_access_securia: true
      })
      .eq('id', userData.user.id)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully',
        user: userData.user 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
