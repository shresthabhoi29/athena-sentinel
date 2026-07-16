function inlineMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}

export function MarkdownPreview({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-sm leading-6 text-zinc-300">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="pt-2 text-base font-semibold text-white">
              {line.slice(4)}
            </h3>
          );
        }

        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="pt-2 text-lg font-semibold text-white">
              {line.slice(3)}
            </h2>
          );
        }

        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="pt-2 text-xl font-semibold text-white">
              {line.slice(2)}
            </h1>
          );
        }

        if (line.startsWith('- ')) {
          return (
            <p
              key={index}
              className="pl-3 text-zinc-400 before:mr-2 before:text-indigo-300 before:content-['•']"
              dangerouslySetInnerHTML={{ __html: inlineMarkdown(line.slice(2)) }}
            />
          );
        }

        if (!line.trim()) {
          return <div key={index} className="h-2" />;
        }

        return <p key={index} dangerouslySetInnerHTML={{ __html: inlineMarkdown(line) }} />;
      })}
    </div>
  );
}
