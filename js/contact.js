export function initContactForm() {
  const form = document.getElementById("contact-form");

  if (!form) return;

  const fields = Array.from(
    form.querySelectorAll(
      "input[required], select[required], textarea[required]",
    ),
  );

  const summary = document.getElementById("form-error-summary");
  const summaryList = document.getElementById("form-error-list");
  const toast = document.getElementById("form-toast");

  function messageFor(field) {
    const validity = field.validity;

    if (validity.valueMissing) {
      if (field.type === "checkbox") {
        return "Vui lòng đồng ý trước khi gửi yêu cầu.";
      }

      return "Vui lòng điền mục này.";
    }

    if (validity.typeMismatch) {
      return "Email chưa đúng dạng, ví dụ: chuvua@gmail.com";
    }

    if (validity.patternMismatch) {
      return "Nhập 10 chữ số, bắt đầu bằng 0. Ví dụ: 0912345678";
    }

    if (validity.tooShort) {
      if (field.id === "ho-ten") {
        return "Họ và tên cần có ít nhất 2 ký tự.";
      }

      if (field.id === "noi-dung") {
        return "Nội dung cần có ít nhất 10 ký tự.";
      }

      return "Nội dung nhập chưa đủ độ dài.";
    }

    return "Dữ liệu chưa hợp lệ.";
  }

  function errorBoxFor(field) {
    const describedBy = field.getAttribute("aria-describedby");

    if (!describedBy) return null;

    const ids = describedBy.split(" ");
    const errorId = ids.find((id) => id.endsWith("-error"));

    if (!errorId) return null;

    return document.getElementById(errorId);
  }

  function showError(field, message) {
    const box = errorBoxFor(field);

    field.setAttribute("aria-invalid", "true");

    if (box) {
      box.textContent = message;
    }
  }

  function clearError(field) {
    const box = errorBoxFor(field);

    field.removeAttribute("aria-invalid");

    if (box) {
      box.textContent = "";
    }
  }

  function validateField(field) {
    if (field.checkValidity()) {
      clearError(field);
      return true;
    }

    showError(field, messageFor(field));
    return false;
  }

  function fieldLabel(field) {
    const label = form.querySelector(`label[for="${field.id}"]`);

    if (!label) {
      return field.name || field.id;
    }

    return label.textContent.replace("*", "").trim();
  }

  function renderSummary(invalidFields) {
    summaryList.replaceChildren();

    if (!invalidFields.length) {
      summary.classList.add("hidden");
      return;
    }

    invalidFields.forEach((field) => {
      const item = document.createElement("li");

      item.textContent = `${fieldLabel(field)}: ${messageFor(field)}`;

      summaryList.appendChild(item);
    });

    summary.classList.remove("hidden");
  }

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      validateField(field);
    });

    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });

    field.addEventListener("change", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFields = fields.filter((field) => !validateField(field));

    renderSummary(invalidFields);

    if (invalidFields.length) {
      invalidFields[0].focus();
      return;
    }

    form.reset();

    fields.forEach(clearError);

    summary.classList.add("hidden");

    toast.classList.remove("hidden");

    window.setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  });
}

initContactForm();
