const state = {
  records: [],
  query: "",
  category: "all",
  status: "all",
  sort: "date-desc",
  loading: true,
  error: null,
};

const loadingBox = document.getElementById("records-loading");
const errorBox = document.getElementById("records-error");
const errorMessage = document.getElementById("records-error-message");
const emptyBox = document.getElementById("records-empty");
const contentBox = document.getElementById("records-content");

const tbody = document.getElementById("records-body");
const template = document.getElementById("row-template");
const count = document.getElementById("record-count");

const searchInput = document.getElementById("record-search");
const categorySelect = document.getElementById("record-category");
const statusSelect = document.getElementById("record-status");
const sortSelect = document.getElementById("record-sort");

const sorters = {
  "date-desc": (a, b) => b.date.localeCompare(a.date),
  "date-asc": (a, b) => a.date.localeCompare(b.date),
  "amount-desc": (a, b) => b.amount - a.amount,
  "amount-asc": (a, b) => a.amount - b.amount,
};

function debounce(fn, delay = 300) {
  let id;

  return (...args) => {
    clearTimeout(id);

    id = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function formatMoney(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatWeight(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} kg`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

function visibleRecords() {
  const query = state.query.trim().toLowerCase();

  return [...state.records]
    .filter(
      (record) =>
        state.category === "all" || record.category === state.category,
    )
    .filter(
      (record) => state.status === "all" || record.status === state.status,
    )
    .filter((record) => !query || record.trader.toLowerCase().includes(query))
    .sort(sorters[state.sort]);
}

function statusLabel(status) {
  const labels = {
    "da-chot": "Đã chốt",
    "dang-xu-ly": "Đang xử lý",
    huy: "Đã hủy",
  };

  return labels[status] ?? status;
}

function buildRow(record) {
  const row = template.content.firstElementChild.cloneNode(true);

  row.querySelector("[data-cell='id']").textContent = record.id;

  row.querySelector("[data-cell='trader']").textContent = record.trader;

  row.querySelector("[data-cell='category']").textContent = record.category;

  row.querySelector("[data-cell='status']").textContent = statusLabel(
    record.status,
  );

  row.querySelector("[data-cell='weight']").textContent = formatWeight(
    record.weight,
  );

  row.querySelector("[data-cell='amount']").textContent = formatMoney(
    record.amount,
  );

  row.querySelector("[data-cell='date']").textContent = formatDate(record.date);

  return row;
}

function render() {
  loadingBox.classList.toggle("hidden", !state.loading);

  errorBox.classList.toggle("hidden", !state.error || state.loading);

  if (state.error) {
    errorMessage.textContent = state.error;
  } else {
    errorMessage.textContent = "";
  }

  const records = visibleRecords();

  const hasRecords = !state.loading && !state.error && records.length > 0;

  const isEmpty = !state.loading && !state.error && records.length === 0;

  emptyBox.classList.toggle("hidden", !isEmpty);
  contentBox.classList.toggle("hidden", !hasRecords);

  count.textContent = `${records.length} bản ghi`;

  if (!hasRecords) {
    tbody.replaceChildren();
    return;
  }

  const rows = records.map(buildRow);

  tbody.replaceChildren(...rows);
}

async function loadRecords() {
  const response = await fetch("./data/records.json");

  if (!response.ok) {
    throw new Error(`Máy chủ trả về ${response.status}`);
  }

  return response.json();
}

const handleSearch = debounce((event) => {
  state.query = event.target.value;
  render();
}, 300);

searchInput.addEventListener("input", handleSearch);

categorySelect.addEventListener("change", (event) => {
  state.category = event.target.value;
  render();
});

statusSelect.addEventListener("change", (event) => {
  state.status = event.target.value;
  render();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  render();
});

async function initRecords() {
  render();

  try {
    state.records = await loadRecords();
  } catch (error) {
    state.error = `Không tải được dữ liệu: ${error.message}`;
  } finally {
    state.loading = false;
    render();
  }
}

initRecords();
