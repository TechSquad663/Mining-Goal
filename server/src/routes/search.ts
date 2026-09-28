import { Router } from 'express';
import { db } from '../database/store.js';

const router = Router();

router.get('/', (req, res) => {
  const query = String(req.query.q || '').toLowerCase().trim();
  if (!query) {
    res.json({
      success: true,
      counts: { documents: 0, reports: 0, mines: 0, aiQueries: 0, topics: 0 },
      results: []
    });
    return;
  }

  const matchingDocs = db.documents.filter(d => 
    d.fileName.toLowerCase().includes(query) ||
    d.summary?.toLowerCase().includes(query) ||
    d.tags.some(t => t.toLowerCase().includes(query))
  ).map(d => ({
    type: 'Document',
    id: d.id,
    title: d.fileName,
    subtitle: `${d.documentType} • ${d.subsidiary} • FY ${d.financialYear}`,
    link: `/documents/${d.id}`
  }));

  const matchingReports = db.reports.filter(r => 
    r.title.toLowerCase().includes(query) ||
    r.referenceNumber.toLowerCase().includes(query) ||
    r.sections.some(s => s.content.toLowerCase().includes(query))
  ).map(r => ({
    type: 'Report',
    id: r.id,
    title: r.title,
    subtitle: `${r.referenceNumber} • Status: ${r.status}`,
    link: `/reports/${r.id}`
  }));

  const matchingMines = db.mineMetrics.filter(m => 
    m.mine.toLowerCase().includes(query) ||
    m.coalfield.toLowerCase().includes(query) ||
    m.subsidiary.toLowerCase().includes(query)
  ).map(m => ({
    type: 'Mine / Area',
    id: m.mine,
    title: m.mine,
    subtitle: `${m.subsidiary} • ${m.coalfield} Coalfield • Output: ${m.productionFY24} MT`,
    link: `/analytics`
  }));

  const matchingTopics = db.topics.filter(t => 
    t.name.toLowerCase().includes(query) ||
    t.relatedTerms.some(term => term.toLowerCase().includes(query))
  ).map(t => ({
    type: 'Topic',
    id: t.id,
    title: t.name,
    subtitle: `Category: ${t.category} • Frequency: ${t.frequency} occurrences`,
    link: `/topics`
  }));

  const totalMatches = matchingDocs.length + matchingReports.length + matchingMines.length + matchingTopics.length;

  res.json({
    success: true,
    query,
    totalMatches,
    counts: {
      documents: matchingDocs.length,
      reports: matchingReports.length,
      mines: matchingMines.length,
      topics: matchingTopics.length
    },
    results: [
      ...matchingDocs.slice(0, 5),
      ...matchingReports.slice(0, 5),
      ...matchingMines.slice(0, 5),
      ...matchingTopics.slice(0, 5)
    ]
  });
});

export default router;
