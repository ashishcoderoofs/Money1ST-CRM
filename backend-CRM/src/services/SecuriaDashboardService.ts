import SecuriaClient from '../models/SecuriaClient';
import Consultant from '../models/Consultant';
import SecuriaAuditLog from '../models/SecuriaAuditLog';
import { AuthRequest } from '../types';
import logger from '../../utils/logger';

/**
 * Service class for Securia dashboard statistics and analytics
 */
export class SecuriaDashboardService {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    try {
      const [
        totalClients,
        activeClients,
        inactiveClients,
        totalConsultants,
        activeConsultants,
        inactiveConsultants,
        recentClients,
        recentActivities
      ] = await Promise.all([
        SecuriaClient.countDocuments(),
        SecuriaClient.countDocuments({ status: 'active' }),
        SecuriaClient.countDocuments({ status: 'inactive' }),
        Consultant.countDocuments(),
        Consultant.countDocuments({ status: 'Active' }),
        Consultant.countDocuments({ status: 'Inactive' }),
        SecuriaClient.find().sort({ createdAt: -1 }).limit(5).populate('consultant', 'firstName lastName'),
        SecuriaAuditLog.find().sort({ timestamp: -1 }).limit(10).populate('userId', 'firstName lastName email')
      ]);

      // Calculate completion rates
      const clientsWithProgress = await SecuriaClient.aggregate([
        {
          $group: {
            _id: null,
            averageCompletion: { $avg: '$completionPercentage' },
            fullyCompleted: {
              $sum: {
                $cond: { if: { $gte: ['$completionPercentage', 100] }, then: 1, else: 0 }
              }
            }
          }
        }
      ]);

      const completionStats = clientsWithProgress[0] || { averageCompletion: 0, fullyCompleted: 0 };

      return {
        success: true,
        data: {
          clients: {
            total: totalClients,
            active: activeClients,
            inactive: inactiveClients,
            averageCompletion: Math.round(completionStats.averageCompletion || 0),
            fullyCompleted: completionStats.fullyCompleted
          },
          consultants: {
            total: totalConsultants,
            active: activeConsultants,
            inactive: inactiveConsultants
          },
          recent: {
            clients: recentClients,
            activities: recentActivities
          }
        }
      };
    } catch (error) {
      logger.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  /**
   * Get chart data for dashboard visualizations
   */
  static async getChartData(period: string = '30d') {
    try {
      const daysBack = period === '7d' ? 7 : period === '90d' ? 90 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Client registrations over time
      const clientRegistrations = await SecuriaClient.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      // Client status distribution
      const statusDistribution = await SecuriaClient.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      // Consultant performance
      const consultantPerformance = await SecuriaClient.aggregate([
        {
          $lookup: {
            from: 'consultants',
            localField: 'consultant',
            foreignField: '_id',
            as: 'consultantInfo'
          }
        },
        { $unwind: '$consultantInfo' },
        {
          $group: {
            _id: '$consultant',
            name: { $first: { $concat: ['$consultantInfo.firstName', ' ', '$consultantInfo.lastName'] } },
            clientCount: { $sum: 1 },
            averageCompletion: { $avg: '$completionPercentage' }
          }
        },
        { $sort: { clientCount: -1 } },
        { $limit: 10 }
      ]);

      // Monthly trends
      const monthlyTrends = await SecuriaClient.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } // Last year
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            clients: { $sum: 1 },
            averageCompletion: { $avg: '$completionPercentage' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      return {
        success: true,
        data: {
          clientRegistrations,
          statusDistribution,
          consultantPerformance,
          monthlyTrends,
          period
        }
      };
    } catch (error) {
      logger.error('Error fetching chart data:', error);
      throw new Error('Failed to fetch chart data');
    }
  }

  /**
   * Get audit logs with filtering
   */
  static async getAuditLogs(req: AuthRequest) {
    const { 
      page = 1, 
      limit = 50, 
      action,
      userId,
      dateFrom,
      dateTo
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};
    
    if (action) {
      filter.action = action;
    }

    if (userId) {
      filter.userId = userId;
    }

    if (dateFrom || dateTo) {
      filter.timestamp = {};
      if (dateFrom) filter.timestamp.$gte = new Date(dateFrom as string);
      if (dateTo) filter.timestamp.$lte = new Date(dateTo as string);
    }

    try {
      const [logs, total] = await Promise.all([
        SecuriaAuditLog
          .find(filter)
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limitNum)
          .populate('userId', 'firstName lastName email'),
        SecuriaAuditLog.countDocuments(filter)
      ]);

      return {
        success: true,
        data: logs,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          count: logs.length,
          totalItems: total
        }
      };
    } catch (error) {
      logger.error('Error fetching audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }

  /**
   * Get system health metrics
   */
  static async getSystemHealth() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [
        recentErrors,
        recentLogins,
        activeSessionsCount,
        dbConnections
      ] = await Promise.all([
        SecuriaAuditLog.countDocuments({ 
          action: 'error',
          timestamp: { $gte: oneHourAgo }
        }),
        SecuriaAuditLog.countDocuments({ 
          action: 'login',
          timestamp: { $gte: oneDayAgo }
        }),
        SecuriaAuditLog.countDocuments({ 
          action: 'securia_session_created',
          timestamp: { $gte: oneDayAgo }
        }),
        // Get database connection info (simplified)
        SecuriaClient.collection.stats()
      ]);

      const health = {
        status: recentErrors > 10 ? 'warning' : recentErrors > 50 ? 'critical' : 'healthy',
        metrics: {
          errorsLastHour: recentErrors,
          loginsLast24h: recentLogins,
          activeSessions: activeSessionsCount,
          databaseSize: Math.round(dbConnections.size / 1024 / 1024), // MB
          uptime: process.uptime()
        },
        timestamp: now
      };

      return {
        success: true,
        data: health
      };
    } catch (error) {
      logger.error('Error getting system health:', error);
      throw new Error('Failed to get system health metrics');
    }
  }
}
