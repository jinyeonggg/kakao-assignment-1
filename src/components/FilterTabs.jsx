const FILTERS = [
  { key: 'all', label: '전체', badge: true },
  { key: 'active', label: '진행 중', badge: true },
  { key: 'done', label: '완료', badge: false },
];

export default function FilterTabs({ currentFilter, counts, onFilterChange }) {
  return (
    <nav className="filter-tabs">
      {FILTERS.map(({ key, label, badge }) => (
        <button
          key={key}
          className={`tab-btn${currentFilter === key ? ' active' : ''}`}
          onClick={() => onFilterChange(key)}
        >
          {label}
          {badge && <span className="tab-badge">{counts[key] ?? 0}</span>}
        </button>
      ))}
    </nav>
  );
}
