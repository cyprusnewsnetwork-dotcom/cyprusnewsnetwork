'use client';

import { useEffect, useState } from 'react';

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Articles</h1>

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Τίτλος</th>
            <th>Ημερομηνία</th>
            <th>Ώρα</th>
            <th>Κατηγορία</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {articles.map(article => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.created_at.split('T')[0]}</td>
              <td>{article.created_at.split('T')[1].slice(0,5)}</td>
              <td>{article.category}</td>
              <td>{article.status}</td>
              <td>
                <a href={`/admin/articles/${article.id}`}>View</a> |{' '}
                <a href={`/admin/articles/${article.id}/edit`}>Edit</a> |{' '}
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
