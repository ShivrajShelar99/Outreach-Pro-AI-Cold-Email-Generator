import jsPDF from 'jspdf';
import { GeneratedEmailData } from '../pages/Dashboard';

export const exportService = {
  async exportToPDF(email: GeneratedEmailData): Promise<void> {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Outreach Pro - Generated Email', 20, 20);
    
    // Add subject
    doc.setFontSize(14);
    doc.text('Subject:', 20, 40);
    doc.setFontSize(12);
    doc.text(email.subject, 20, 50);
    
    // Add content
    doc.setFontSize(14);
    doc.text('Email Content:', 20, 70);
    doc.setFontSize(10);
    
    // Split content into lines
    const lines = doc.splitTextToSize(email.content, 170);
    doc.text(lines, 20, 80);
    
    // Add job details
    const contentHeight = lines.length * 4 + 90;
    doc.setFontSize(14);
    doc.text('Target Job:', 20, contentHeight);
    doc.setFontSize(12);
    doc.text(`${email.jobListing.title} at ${email.jobListing.company}`, 20, contentHeight + 10);
    
    // Save the PDF
    doc.save(`outreach-email-${email.id}.pdf`);
  },

  async exportToTXT(email: GeneratedEmailData): Promise<void> {
    const content = `
Outreach Pro - Generated Email
==============================

Subject: ${email.subject}

Email Content:
${email.content}

Target Job: ${email.jobListing.title} at ${email.jobListing.company}

Generated on: ${new Date(email.timestamp).toLocaleString()}

Portfolio Links:
${email.portfolioLinks.map(link => `- ${link}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outreach-email-${email.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};