const STORAGE_KEY = "annie-records";

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

const addButton = document.getElementById("add-record");
const resetButton = document.getElementById("reset-records");

const dialog = document.getElementById("record-dialog");
const form = document.getElementById("record-form");
const closeDialogButton = document.getElementById("close-record-dialog");
const cancelButton = document.getElementById("cancel-record");

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

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function readStoredRecords() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
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

function statusLabel(status) {
  const labels = {
    "da-chot": "Đã chốt",
    "dang-xu-ly": "Đang xử lý",
    huy: "Đã hủy",
  };

  return labels[status] ?? status;
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

  const deleteButton = row.querySelector("[data-delete]");

  deleteButton.dataset.id = record.id;

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

async function fetchSampleRecords() {
  const response = await fetch("./data/records.json");

  if (!response.ok) {
    throw new Error(`Máy chủ trả về ${response.status}`);
  }

  return response.json();
}

async function loadRecords() {
  const stored = readStoredRecords();

  if (stored) {
    return stored;
  }

  const sampleRecords = await fetchSampleRecords();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleRecords));

  return sampleRecords;
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

addButton.addEventListener("click", () => {
  form.reset();
  dialog.showModal();
});

closeDialogButton.addEventListener("click", () => {
  dialog.close();
});

cancelButton.addEventListener("click", () => {
  dialog.close();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);

  const record = {
    id: String(formData.get("id")).trim(),
    trader: String(formData.get("trader")).trim(),
    category: String(formData.get("category")),
    status: String(formData.get("status")),
    weight: Number(formData.get("weight")),
    amount: Number(formData.get("amount")),
    date: String(formData.get("date")),
  };

  const duplicate = state.records.some((item) => item.id === record.id);

  if (duplicate) {
    alert("Mã giao dịch đã tồn tại.");
    return;
  }

  state.records = [record, ...state.records];

  saveRecords();
  render();

  dialog.close();
});

tbody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete]");

  if (!button) return;

  const id = button.dataset.id;

  const accepted = window.confirm(`Bạn có chắc muốn xóa bản ghi ${id}?`);

  if (!accepted) return;

  state.records = state.records.filter((record) => record.id !== id);

  saveRecords();
  render();
});

resetButton.addEventListener("click", async () => {
  const accepted = window.confirm("Khôi phục lại toàn bộ dữ liệu mẫu?");

  if (!accepted) return;

  resetButton.disabled = true;

  try {
    state.error = null;
    state.records = await fetchSampleRecords();

    saveRecords();
    render();
  } catch (error) {
    state.error = `Không khôi phục được dữ liệu: ${error.message}`;

    render();
  } finally {
    resetButton.disabled = false;
  }
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
