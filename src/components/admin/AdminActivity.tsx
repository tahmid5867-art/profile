import React from 'react';
import { useData } from '../../context/DataContext';
import {
  History,
  Shield,
  Clock,
  User,
  Info,
  Layers,
} from 'lucide-react';

export const AdminActivity: React.FC = () => {
  const { activityLogs } = useData();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FC] tracking-tight">
          Administrative Activity History
        </h2>
        <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
          Chronological record of portfolio updates, publications, and inquiry management.
        </p>
      </div>

      {/* Audit Log Architecture Note */}
      <div className="p-4 rounded-2xl bg-[#18243A]/70 border border-[#29354B] flex items-start gap-3 text-xs text-[#A7B2C8] leading-relaxed">
        <Info className="w-5 h-5 text-[#6C9BFF] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#F5F7FC]">Audit Trail Note:</strong> This activity history records management actions in Cloud Firestore with the authenticated administrator's credentials. While suitable for portfolio change tracking, enterprise-grade append-only tamper-proof audit trails require dedicated serverless Cloud Functions or Cloud Logging.
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-[#121A2B] border border-[#29354B] overflow-hidden">
        {activityLogs.length === 0 ? (
          <div className="p-12 text-center text-[#A7B2C8] space-y-2">
            <History className="w-10 h-10 mx-auto text-[#A7B2C8]/50" />
            <p className="text-sm font-semibold text-[#F5F7FC]">No actions recorded yet.</p>
            <p className="text-xs">Administrative actions will automatically generate logs here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#18243A] text-[#A7B2C8] uppercase font-bold text-[11px] tracking-wider border-b border-[#29354B]">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29354B]/70">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#18243A]/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#6C9BFF]">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#A7B2C8]">
                      {log.resourceType}
                    </td>
                    <td className="py-3.5 px-4 text-[#F5F7FC]">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 text-[#A7B2C8] text-xs">
                      {log.performedBy}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[11px] text-[#A7B2C8] font-mono whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
