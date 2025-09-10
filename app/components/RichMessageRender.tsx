import { RichMessage } from "@/lib/types";

export default function RichMessageRenderer({ content } : {content : string}) {
    const message : RichMessage = JSON.parse(content);
    return (
        <div className="bg-blue-600 text-white self-start p-4 rounded">
            {message.content.map((block, idx) => {
                switch (block.type) {
                    case "title":
                        return <h1 key={idx} className="text-2xl font-bold">{block.text}</h1>;

                    case "subtitle":
                        return <h2 key={idx} className="text-xl font-semibold">{block.text}</h2>;

                    case "paragraph":
                        return <p key={idx} className="text-gray-100">{block.text}</p>;

                    case "code":
                        return (
                            <pre key={idx} className="bg-gray-900 p-2 rounded overflow-auto">
                                <code>{block.code}</code>
                            </pre>
                        );

                    case "table":
                        return (
                            <table key={idx} className="table-auto border-collapse border border-gray-300 my-4 text-black bg-white">
                                <thead>
                                    <tr>
                                        {block.headers.map((header, hIdx) => (
                                            <th key={hIdx} className="border px-2">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {block.rows.map((row, rIdx) => (
                                        <tr key={rIdx}>
                                            {row.map((cell, cIdx) => (
                                                <td key={cIdx} className="border px-2">{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}
