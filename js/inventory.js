// Inventory simulator shared by the controls page and other lessons.
const HOTBAR_SIZE = 9;
const INVENTORY_SIZE = 27;

function copySlots(slots, size, label) {
  if (!Array.isArray(slots) || slots.length !== size) {
    throw new RangeError(`${label} must contain exactly ${size} slots.`);
  }
  return [...slots];
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export function createInventorySimulator(hotbarEl, invEl, options = {}) {
  if (!hotbarEl || !invEl) {
    throw new TypeError('Hotbar and inventory elements are required.');
  }
  if (options.onChange != null && typeof options.onChange !== 'function') {
    throw new TypeError('onChange must be a function.');
  }

  let hotbar = options.hotbar
    ? copySlots(options.hotbar, HOTBAR_SIZE, 'Hotbar')
    : Array(HOTBAR_SIZE).fill(null);
  let inventory = options.inventory
    ? copySlots(options.inventory, INVENTORY_SIZE, 'Inventory')
    : Array(INVENTORY_SIZE).fill(null);
  let selected = null;

  function notifyChange() {
    if (options.onChange) {
      options.onChange({ hotbar: [...hotbar], inventory: [...inventory] });
    }
  }

  function slotHTML(item, from, index) {
    const isSelected = selected && selected.from === from && selected.index === index;
    const slotNumber = from === 'hotbar'
      ? `<span class="slot-num">${index + 1}</span>`
      : '';
    const icon = item ? `<span class="slot-icon">${escapeHTML(item.icon)}</span>` : '';
    const label = from === 'hotbar' ? `Hotbar slot ${index + 1}` : `Inventory slot ${index + 1}`;
    return `<button type="button" class="inv-slot ${isSelected ? 'selected' : ''}"
      data-from="${from}" data-index="${index}" aria-label="${label}">
      ${slotNumber}${icon}
    </button>`;
  }

  function render() {
    hotbarEl.innerHTML = hotbar.map((item, index) => slotHTML(item, 'hotbar', index)).join('');
    invEl.innerHTML = inventory.map((item, index) => slotHTML(item, 'inv', index)).join('');
    [...hotbarEl.children, ...invEl.children].forEach(element => {
      element.addEventListener('click', () => onClick(element.dataset.from, Number(element.dataset.index)));
    });
  }

  function onClick(from, index) {
    const source = from === 'hotbar' ? hotbar : inventory;
    if (!Number.isInteger(index) || index < 0 || index >= source.length) return;

    if (!selected) {
      if (source[index]) {
        selected = { from, index };
        render();
      }
      return;
    }

    const selectedSlots = selected.from === 'hotbar' ? hotbar : inventory;
    const targetSlots = from === 'hotbar' ? hotbar : inventory;
    const item = targetSlots[index];
    targetSlots[index] = selectedSlots[selected.index];
    selectedSlots[selected.index] = item;
    selected = null;
    render();
    notifyChange();
  }

  render();
  return {
    getState: () => ({ hotbar: [...hotbar], inventory: [...inventory] }),
    reset: (nextHotbar, nextInventory) => {
      const updatedHotbar = nextHotbar
        ? copySlots(nextHotbar, HOTBAR_SIZE, 'Hotbar')
        : Array(HOTBAR_SIZE).fill(null);
      const updatedInventory = nextInventory
        ? copySlots(nextInventory, INVENTORY_SIZE, 'Inventory')
        : Array(INVENTORY_SIZE).fill(null);
      hotbar = updatedHotbar;
      inventory = updatedInventory;
      selected = null;
      render();
      notifyChange();
    },
    sort: () => {
      inventory.sort((a, b) => {
        if (!a && !b) return 0;
        if (!a) return 1;
        if (!b) return -1;
        return String(a.name ?? '').localeCompare(String(b.name ?? ''));
      });
      selected = null;
      render();
      notifyChange();
    },
  };
}
