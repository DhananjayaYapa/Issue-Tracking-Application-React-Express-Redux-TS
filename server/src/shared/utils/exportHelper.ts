// @ts-expect-error - json2csv has no type declarations
import { Parser } from 'json2csv';
import type { IssueExportRow } from "../../types/index.js";

export type { IssueExportRow };

export const exportIssuesToCSV = (issues: IssueExportRow[]): string => {
    if (!issues || issues.length === 0) {
        return 'No data to export';
    }

    const fields = [
        { label: 'Issue ID',     value: 'id' },
        { label: 'Title',        value: 'title' },
        { label: 'Description',  value: 'description' },
        { label: 'Status',       value: 'status' },
        { label: 'Priority',     value: 'priority' },
        { label: 'Created By',   value: 'createdBy' },
        { label: 'Resolved At',  value: 'resolvedAt' },
        { label: 'Created At',   value: 'createdAt' },
    ];

    const parser = new Parser({ fields });
    return parser.parse(issues) as string;
};

export const exportIssuesToJSON = (issues: IssueExportRow[]) => {
    return {
        exportDate: new Date().toISOString(),
        totalCount: issues.length,
        issues: issues.map((i) => ({
            id: i.id,
            title: i.title,
            description: i.description,
            status: i.status,
            priority: i.priority,
            createdBy: i.createdBy,
            resolvedAt: i.resolvedAt,
            createdAt: i.createdAt,
        })),
    };
};
