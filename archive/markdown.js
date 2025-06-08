function loadMarkdownSection(markdownPath, heading, targetId) {
  fetch(markdownPath)
    .then(response => response.text())
    .then(text => {
      // Extract section between the specified heading and the next same-level heading or end of file
      const regex = new RegExp(`## ${heading}([\\s\\S]*?)(^## |\\Z)`, 'm');
      const match = text.match(regex);
      const section = match ? `## ${heading}` + match[1] : 'Section not found.';
      document.getElementById(targetId).innerHTML = marked.parse(section);
    });
}