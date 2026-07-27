import { type RagIngestResponse } from "../types/api";

type RagIngestionPanelProps = {
  data: RagIngestResponse | null;
  loading: boolean;
  onIngest: () => Promise<void>;
};

/**
 * RAG 文档导入面板。
 *
 * 这个组件只负责 Day 9 的“导入样例 Markdown 文档”动作：
 * 1. 点击按钮触发后端 /rag/ingest；
 * 2. 展示导入数量和重复数量；
 * 3. 展示每篇文档的元数据，方便后续做 chunking 时检查来源是否正确。
 */
export function RagIngestionPanel({ data, loading, onIngest }: RagIngestionPanelProps) {
  return (
    <div className="stack">
      <div className="ingest-intro">
        <p>
          当前阶段只做文档导入：从后端 <code>docs/sample-docs</code> 读取 Markdown，
          并返回文档级元数据。导入完成后，可以切到“文档切片调试”查看 Day 10 生成的 chunks。
        </p>
      </div>

      <div className="actions">
        <button className="primary-button" type="button" disabled={loading} onClick={() => void onIngest()}>
          {loading ? "正在导入知识库..." : "导入 docs/sample-docs"}
        </button>
      </div>

      {loading ? (
        <div className="answer-card">
          <div className="placeholder-block">正在读取 Markdown 文档并生成元数据。</div>
        </div>
      ) : null}

      {!loading && !data ? (
        <div className="answer-card">
          <div className="empty-card">
            <h4>还没有导入结果</h4>
            <p>点击导入按钮后，这里会展示文档数量、重复文档数量和每篇文档的元数据。</p>
          </div>
        </div>
      ) : null}

      {!loading && data ? (
        <div className="answer-card">
          <div className="answer-card__header">
            <h3>文档导入结果</h3>
          </div>

          <div className="meta-grid">
            <div className="meta-card">
              <span className="meta-label">成功导入</span>
              <strong>{data.importedCount} 篇</strong>
            </div>
            <div className="meta-card">
              <span className="meta-label">重复跳过</span>
              <strong>{data.duplicateCount} 篇</strong>
            </div>
          </div>

          <div className="document-table-wrap">
            <table className="document-table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>文件名</th>
                  <th>Doc ID</th>
                  <th>Content Hash</th>
                  <th>导入时间</th>
                </tr>
              </thead>
              <tbody>
                {data.documents.map((document) => (
                  <tr key={document.docId}>
                    <td>{document.title}</td>
                    <td>
                      <code>{document.fileName}</code>
                    </td>
                    <td>
                      <code>{document.docId}</code>
                    </td>
                    <td>
                      <code>{document.contentHash.slice(0, 12)}...</code>
                    </td>
                    <td>{formatDateTime(document.ingestedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * 把后端 LocalDateTime 字符串转换成页面上更容易读的本地时间。
 *
 * 如果浏览器无法解析，就直接展示原始值，避免因为格式问题导致页面报错。
 */
function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}
