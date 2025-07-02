// pages/api/generate-pdf.js
import PDFDocument from 'pdfkit';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const resumeData = req.body.optimized_resume;
    
    if (!resumeData) {
      return res.status(400).json({ message: 'Invalid JSON structure. Expected "optimized_resume" object.' });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 54, bottom: 54, left: 54, right: 54 }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');

    // Pipe the PDF to the response
    doc.pipe(res);

    // Define fonts and styles
    const fonts = {
      regular: 'Times-Roman',
      bold: 'Times-Bold',
      italic: 'Times-Italic'
    };

    const styles = {
      name: { font: fonts.bold, size: 16 },
      contact: { font: fonts.regular, size: 10 },
      sectionHeader: { font: fonts.bold, size: 11 },
      roleTitle: { font: fonts.bold, size: 12 },
      body: { font: fonts.regular, size: 10 },
      bold: { font: fonts.bold, size: 10 }
    };

    let y = 72; // Starting Y position

    // Helper functions
    function addText(text, x, yPos, style = styles.body, maxWidth = null) {
      doc.font(style.font).fontSize(style.size);
      if (maxWidth) {
        doc.text(text, x, yPos, { width: maxWidth, align: 'left' });
      } else {
        doc.text(text, x, yPos);
      }
      return doc.y;
    }

    function addSectionHeader(title, yPos) {
      const newY = addText(title, 72, yPos, styles.sectionHeader);
      // Add underline
      doc.moveTo(72, newY + 2)
         .lineTo(522, newY + 2)
         .stroke();
      return newY + 8;
    }

    function addBulletPoint(text, yPos, indent = 0) {
      const x = 72 + indent;
      addText('•', x, yPos, styles.body);
      return addText(text, x + 15, yPos, styles.body, 450 - indent);
    }

    // Header - Name
    y = addText(resumeData.contact_info.name, 72, y, styles.name);
    
    // Center the name
    const nameWidth = doc.widthOfString(resumeData.contact_info.name, styles.name);
    doc.font(styles.name.font).fontSize(styles.name.size);
    doc.text(resumeData.contact_info.name, (612 - nameWidth) / 2, 72);

    y = 72 + 20;

    // Contact Info
    const contactParts = [
      resumeData.contact_info.location,
      resumeData.contact_info.phone,
      resumeData.contact_info.email,
      resumeData.contact_info.linkedin
    ].filter(Boolean);
    
    const contactLine = contactParts.join(' | ');
    const contactWidth = doc.widthOfString(contactLine, styles.contact);
    y = addText(contactLine, (612 - contactWidth) / 2, y, styles.contact);
    y += 15;

    // Role Title and Professional Summary
    const roleTitle = `${resumeData.role_title} PROFESSIONAL SUMMARY`;
    y = addSectionHeader(roleTitle, y);

    // Summary bullets
    resumeData.professional_summary.forEach(summary => {
      y = addBulletPoint(summary, y);
      y += 5;
    });

    y += 5;

    // Skills Section
    y = addSectionHeader('SKILLS', y);

    // Technical Skills
    const techSkillsText = `Technical Skills: ${resumeData.skills.technical_skills}`;
    doc.font(styles.bold.font).fontSize(styles.bold.size);
    const techLabelWidth = doc.widthOfString('Technical Skills: ');
    doc.text('Technical Skills: ', 72, y);
    doc.font(styles.body.font);
    y = addText(resumeData.skills.technical_skills, 72 + techLabelWidth, y, styles.body, 450 - techLabelWidth);
    y += 8;

    // Tools & Technologies
    doc.font(styles.bold.font).fontSize(styles.bold.size);
    const toolsLabelWidth = doc.widthOfString('Tools & Technologies: ');
    doc.text('Tools & Technologies: ', 72, y);
    doc.font(styles.body.font);
    y = addText(resumeData.skills.tools_technologies, 72 + toolsLabelWidth, y, styles.body, 450 - toolsLabelWidth);
    y += 10;

    // Work Experience
    y = addSectionHeader('WORK EXPERIENCE', y);

    resumeData.work_experience.forEach(exp => {
      // Job header
      const jobTitle = `${exp.role}, ${exp.company}${exp.location ? ', ' + exp.location : ''}`;
      doc.font(styles.bold.font).fontSize(styles.bold.size);
      doc.text(jobTitle, 72, y);
      
      // Duration (right-aligned)
      const durationWidth = doc.widthOfString(exp.duration);
      doc.text(exp.duration, 522 - durationWidth, y);
      y += 15;

      // Achievements
      exp.achievements.forEach(achievement => {
        y = addBulletPoint(achievement, y);
        y += 3;
      });
      y += 8;
    });

    // Education
    y = addSectionHeader('EDUCATION', y);

    resumeData.education.forEach(edu => {
      const eduText = `${edu.program} | ${edu.institution}`;
      doc.font(styles.bold.font).fontSize(styles.bold.size);
      doc.text(eduText, 72, y);
      
      // Duration (right-aligned)
      const durationWidth = doc.widthOfString(edu.duration);
      doc.text(edu.duration, 522 - durationWidth, y);
      y += 12;
    });

    y += 5;

    // Certifications
    y = addSectionHeader('LICENCES/CERTIFICATIONS', y);

    resumeData.certifications.forEach(cert => {
      doc.font(styles.bold.font).fontSize(styles.bold.size);
      doc.text(cert.name, 72, y);
      
      // Date (right-aligned)
      const dateWidth = doc.widthOfString(cert.date);
      doc.text(cert.date, 522 - dateWidth, y);
      y += 12;
    });

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
}
