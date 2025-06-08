function loadMarkdownSection(markdownPath, heading, targetId) {
  fetch(markdownPath)
    .then(response => response.text())
    .then(text => {
      const lines = text.split('\n');
      let capturing = false;
      let content = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if this line contains our target heading (any level #, ##, ###, etc.)
        const trimmedLine = line.trim();
        if (trimmedLine.endsWith(heading) && trimmedLine.startsWith('#')) {
          // Extract the heading level and text
          const match = trimmedLine.match(/^(#+)\s*(.*)$/);
          if (match && match[2].trim() === heading) {
            capturing = true;
            content.push(line); // Include the heading
            continue;
          }
        }
        
        // If we hit another heading while capturing, stop
        if (capturing && trimmedLine.startsWith('#')) {
          // Check if it's a heading at same or higher level
          const currentMatch = trimmedLine.match(/^(#+)/);
          if (currentMatch && trimmedLine !== content[0].trim()) {
            break;
          }
        }
        
        // If we're capturing, add the line
        if (capturing) {
          content.push(line);
        }
      }
      
      let section = content.length > 0 ? content.join('\n') : 'Section not found.';
      document.getElementById(targetId).innerHTML = marked.parse(section);
    })
    .catch(error => {
      console.error('Error loading markdown:', error);
      document.getElementById(targetId).innerHTML = 'Error loading content.';
    });
}

// Update the chapter parsing logic to continue until next # heading
function parseChapters(text) {
    const chapters = [];
    const lines = text.split('\n');
    let currentChapter = null;
    let currentContent = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if line starts with # (chapter heading)
        if (line.startsWith('# ')) {
            // Save previous chapter if exists
            if (currentChapter) {
                chapters.push({
                    title: currentChapter,
                    content: currentContent.join('\n').trim()
                });
            }
            
            // Start new chapter
            currentChapter = line.substring(2).trim(); // Remove '# '
            currentContent = [];
        } else if (currentChapter) {
            // Add content to current chapter (including empty lines)
            currentContent.push(line);
        }
    }
    
    // Don't forget the last chapter
    if (currentChapter) {
        chapters.push({
            title: currentChapter,
            content: currentContent.join('\n').trim()
        });
    }
    
    return chapters;
}