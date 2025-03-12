import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BotResponseProps {
  message: {
    query: string;
    table: {
      columns: string[];
      rows: any[][];
    };
    answer: string;
  };
}

const BotResponse: React.FC<BotResponseProps> = ({ message }) => {
    console.log(message);
  return (
    <div className="w-full bg-gray-200 p-4 rounded-lg">
      {/* Query Section */}
      <div className="mb-4">
        <p className="font-bold">Query:</p>
        <div  className="whitespace-pre-wrap break-words bg-white p-3 rounded-md border border-gray-300">
        <ReactMarkdown remarkPlugins={[remarkGfm]} >
        {`\`\`\`sql
${message.query}
\`\`\``}
      </ReactMarkdown>
      </div>
      </div>
      {/* Query as a Code Block */}

      {/* Table Section */}
      <div className="mb-4 overflow-x-auto">
        <p className="font-bold">Execution Result:</p>
        <table className="min-w-full border-collapse border-2 border-black">
          <thead className = "border-2 border-black">
            <tr className="border-2 border-black">
              {message.table.columns.map((column, index) => (
                <th key={index} className="border-2 border-black px-4 py-2 text-left">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-2 border-black">
            {message.table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-2 border-black">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-2 border-black px-4 py-2">
                    {typeof cell === "object" ? JSON.stringify(cell) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Answer Section */}
      <div className="mt-4">
        <p className="font-bold">Answer:</p>
        <ReactMarkdown remarkPlugins={[remarkGfm]} >
          {message.answer}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default BotResponse;
