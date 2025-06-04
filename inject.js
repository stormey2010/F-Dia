function injectCustomButton() {
  console.log('[F Dia] Running injectCustomButton…');

  const list = document.querySelector(
    'mat-action-list.mat-mdc-action-list.mat-mdc-list-base.mdc-list.ui-improvements-phase-1' +
    '[aria-label="Upload file options"]'
  );

  if (!list) {
    console.log('[F Dia] mat-action-list not found.');
    return;
  }

  if (document.getElementById('add-tab')) {
    console.log('[F Dia] Button already injected.');
    return;
  }

  console.log('[F Dia] Injecting button…');

  const btn = document.createElement('button');
  btn.id = 'add-tab';
  btn.textContent = 'Add Tabs';
  btn.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    background: transparent;
    color: white;
    font-size: 15px;
    z-index: 9999;
    cursor: pointer;
  `;

  btn.innerHTML = `
    <span style="
        margin-left: 13px;
        font-weight: 500;
        font-family: 'Google Sans Flex', 'Google Sans', 'Helvetica Neue', sans-serif;
        font-size: 1.25rem;
        line-height: 1.25rem;
      ">@</span>
    <span class="menu-text ng-star-inserted"
      style="
        margin-left: 13px;
        font-weight: 500;
        font-family: 'Google Sans Flex', 'Google Sans', 'Helvetica Neue', sans-serif;
        font-size: 0.875rem;
        line-height: 1.25rem;
      "
    >
      Add tabs
    </span>
  `;
  btn.onclick = () => {
    console.log('[F Dia] Button clicked');
    const overlay = document.createElement('div');
    overlay.id = 'custom-modal-overlay';
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0;
      width:100%; height:100%;
      background: rgba(0,0,0,0.5);
      z-index:10000;
    `;
    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.style.cssText = `
      position:fixed;
      width:40vw; height:40vh;
      top:50%; left:50%;
      transform: translate(-50%,-50%);
      background:#383c3c; 
      padding:16px;
      border-radius:8px;
      overflow-y:auto;
      z-index:10001;
    `;
    document.body.append(overlay, modal);

    chrome.runtime.sendMessage({ action: 'getTabs' }, resp => {
      const validTabs = resp.tabs.filter(t =>
        t.url && (t.url.startsWith('http://') || t.url.startsWith('https://'))
      );

      const grid = document.createElement('div');
      grid.style.cssText = `
        display:grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap:8px;
      `;

      const allCell = document.createElement('div');
      allCell.dataset.all = 'true';
      allCell.innerHTML = '<span style="font-size:0.75rem">All Tabs</span>';
      allCell.style.cssText = `
        border:3px solid #ccc;
        border-radius:8px;
        padding:8px;
        text-align:center;
        cursor:pointer;
      `;
      allCell.addEventListener('click', () => {
        const selectAll = allCell.classList.toggle('selected');
        allCell.style.borderColor = selectAll ? '#007bff' : '#ccc';
        grid.querySelectorAll('div[data-tab-id]').forEach(cell => {
          cell.classList[selectAll ? 'add' : 'remove']('selected');
          cell.style.borderColor = selectAll ? '#007bff' : '#ccc';
          cell.style.pointerEvents = selectAll ? 'none' : 'auto';
        });
      });
      grid.appendChild(allCell);

      validTabs.forEach(tab => {
        const words = tab.title.split(/\s+/);
        const displayTitle = words.length > 5
          ? words.slice(0,5).join(' ') + '...'
          : tab.title;

        const cell = document.createElement('div');
        cell.style.cssText = `
          border:3px solid #ccc;
          border-radius:8px;
          padding:8px;
          text-align:center;
          cursor:pointer;
        `;
        cell.dataset.tabId = tab.id;
        cell.innerHTML = `
          <img src="${tab.favIcon}" style="width:24px;height:24px"/><br/>
          <span style="font-size:0.75rem; font-family: 'Google Sans Flex', 'Google Sans', 'Helvetica Neue', sans-serif;">${displayTitle}</span>
        `;
        cell.addEventListener('click', () => {
          cell.classList.toggle('selected');
          cell.style.borderColor = cell.classList.contains('selected') ? '#007bff' : '#ccc';
        });
        grid.appendChild(cell);
      });

      const scrollContainer = document.createElement('div');
      scrollContainer.style.cssText = `
        overflow-y: auto;
        max-height: calc(100% - 56px);  /* leave space for Add button */
        margin-bottom: 8px;
      `;
      scrollContainer.appendChild(grid);

      const addBtn = document.createElement('button');
      addBtn.textContent = 'Add';
      addBtn.style.cssText = `
        position: absolute;
        bottom: 16px;
        right: 16px;
        padding:8px 16px;
        cursor:pointer;
      `;
      addBtn.addEventListener('click', () => {
        const chosenIds = Array.from(grid.querySelectorAll('.selected'))
          .map(el => el.dataset.tabId);

        chrome.runtime.sendMessage(
          { action: 'scrapeTabs', tabs: chosenIds },
          resp => {
            const editor = document.querySelector('rich-textarea .ql-editor');
            if (!editor) return;
            chosenIds.forEach((id, i) => {
              const tab = validTabs.find(t => String(t.id) === id);
              const text = resp.texts[i] || '';
              editor.innerHTML += `
                <p>${tab.title} - content:</p>
                <p>${text}</p>
              `;
            });
            document.getElementById('custom-modal-overlay').remove();
            document.getElementById('custom-modal').remove();
          }
        );
      });

      const modal = document.getElementById('custom-modal');
      modal.append(scrollContainer, addBtn);
    });

    overlay.addEventListener('click', () => {
      overlay.remove();
      modal.remove();
    });
  };

  btn.addEventListener('mouseenter', () => {
    btn.style.background = '#383c3c';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'transparent';
  });

  list.appendChild(btn);
  console.log('[F Dia] Button injected');
}

const observer = new MutationObserver(() => {
  injectCustomButton();
});
observer.observe(document.body, { childList: true, subtree: true });

console.log('[F Dia] Script loaded. running initial injection');
injectCustomButton();
