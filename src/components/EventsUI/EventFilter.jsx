import "../../styles/EventFilter.css";

const EventFilter = ({ search, setSearch, category, setCategory }) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="coding">Coding</option>
        <option value="dance">Dance</option>
        <option value="workshop">Workshop</option>
        <option value="presentation">Presentation</option>
      </select>
    </div>
  );
};

export default EventFilter;
