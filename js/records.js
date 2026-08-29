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

function buildRow(record) {
  const row = template.content.firstElementChild.cloneNode(true);

  row.querySelector("[data-cell='id']").textContent = record.id;

  row.querySelector("[data-cell='trader']").textContent = record.trader;

  row.querySelector("[data-cell='category']").textContent = record.category;

  row.querySelector("[data-cell='status']").textContent = record.status;

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
  }

  const hasRecords = !state.loading && !state.error && state.records.length > 0;

  const isEmpty = !state.loading && !state.error && state.records.length === 0;

  emptyBox.classList.toggle("hidden", !isEmpty);
  contentBox.classList.toggle("hidden", !hasRecords);

  count.textContent = `${state.records.length} bản ghi`;

  if (!hasRecords) {
    tbody.replaceChildren();
    return;
  }

  const rows = state.records.map(buildRow);

  tbody.replaceChildren(...rows);
}

async function loadRecords() {
  const response = await fetch("./data/records.json");

  if (!response.ok) {
    throw new Error(`Máy chủ trả về ${response.status}`);
  }

  return response.json();
}

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
