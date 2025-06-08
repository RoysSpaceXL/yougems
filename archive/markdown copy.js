function loadMarkdownSection(markdownPath, heading, targetId) {
  fetch(markdownPath)
    .then(response => response.text())
    .then(text => {
      text = text.trimStart();
      // Improved regex: match "# Chapter1" at line start, capture until next heading or end of file
      const regex = new RegExp(
        `^\\s*#\\s*${heading}\\s*\\r?\\n([\\s\\S]*?)(?=^\\s*#|$)`,
        'm'
      );
      const match = regex.exec(text);
      let section = 'Section not found.';
      if (match) {
        section = `# ${heading}\n${match[1]}`;
      }
      document.getElementById(targetId).innerHTML = marked.parse(section);
    });
}