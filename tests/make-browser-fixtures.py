"""Generate fictional, ignored browser-test files. No personal CVs are used."""
from pathlib import Path
from xml.sax.saxutils import escape
import zipfile

root = Path(__file__).resolve().parents[1] / 'artifacts'
root.mkdir(exist_ok=True)
lines = ['Avery Example', 'avery@example.org', 'Education', 'BSc Computer Science, Example University, 2025', 'Skills', 'Python, React, SQL, Git', 'Projects', 'Built a sample library tool with Python and SQL for 20 users.', 'Implemented 40 tests covering validation and permissions.', 'Experience', 'Mentored students in programming and debugging.']
lines += ['Developed reproducible examples and documented limitations for the team.'] * 20
text = '\n'.join(lines)
(root / 'sample.txt').write_text(text, encoding='utf-8')

def pdf(path, content):
    stream = 'BT /F1 10 Tf 40 800 Td 14 TL\n'
    for line in content:
        literal = line.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        stream += f'({literal}) Tj T*\n'
    stream += 'ET'
    objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', f'<< /Length {len(stream.encode())} >>\nstream\n{stream}\nendstream']
    output = bytearray(b'%PDF-1.4\n'); offsets = [0]
    for i, obj in enumerate(objects, 1):
        offsets.append(len(output)); output.extend(f'{i} 0 obj\n{obj}\nendobj\n'.encode())
    xref = len(output)
    output.extend(f'xref\n0 {len(offsets)}\n0000000000 65535 f \n'.encode())
    output.extend(''.join(f'{n:010} 00000 n \n' for n in offsets[1:]).encode())
    output.extend(f'trailer\n<< /Size {len(offsets)} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF'.encode())
    path.write_bytes(output)

pdf(root / 'sample.pdf', lines)
pdf(root / 'scanned.pdf', [])
(root / 'corrupt.pdf').write_bytes(b'%PDF-invalid')
(root / 'oversized.txt').write_bytes(b'x' * (5 * 1024 * 1024 + 1))
with zipfile.ZipFile(root / 'sample.docx', 'w', compression=zipfile.ZIP_DEFLATED) as doc:
    doc.writestr('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
    doc.writestr('_rels/.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
    doc.writestr('word/document.xml', '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + ''.join(f'<w:p><w:r><w:t>{escape(line)}</w:t></w:r></w:p>' for line in lines) + '</w:body></w:document>')
print('Fictional fixtures created in artifacts/.')
