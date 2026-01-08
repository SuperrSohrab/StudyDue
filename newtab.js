document.addEventListener('DOMContentLoaded', () => {
	const popup = document.getElementById('popup');
	const addBtn = document.getElementById('add-project-btn');
	const cancelBtn = document.getElementById('popup-cancel');
	const submitBtn = document.getElementById('popup-add');
	const timeEl = document.getElementById('mytime');
	const greetingEl = document.getElementById('greeting');
	const projectInput = document.getElementById('projectname');
	const dueDateInput = document.getElementById('duedate');
	const projectListEl = document.getElementById('project-list');
	const searchInput = document.querySelector('.search-bar input[type="text"]');

	const readProjects = () => {
		try {
			return JSON.parse(localStorage.getItem('projects') || '[]');
		} catch (err) {
			return [];
		}
	};

	const setRandomSearchPlaceholder = () => {
		if (!searchInput) return;
		const quotes = [
			"Start where you are.",
			"Small steps, big gains.",
			"Progress over perfection.",
			"One page at a time.",
			"Keep going, you're close.",
			"Focus beats luck.",
			"Curiosity fuels learning.",
			"Build today for tomorrow.",
			"You’ve got this.",
			"Deep work, clear mind."
		];
		const pick = quotes[Math.floor(Math.random() * quotes.length)];
		searchInput.setAttribute('placeholder', pick);
	};

	const sortByDueDate = (projects) => {
		return projects.slice().sort((a, b) => {
			const aDate = a.due ? new Date(a.due).getTime() : Number.POSITIVE_INFINITY;
			const bDate = b.due ? new Date(b.due).getTime() : Number.POSITIVE_INFINITY;
			if (aDate !== bDate) return aDate - bDate;
			return (a.savedAt || 0) - (b.savedAt || 0);
		});
	};

	const renderProjects = () => {
		if (!projectListEl) return;
		const projects = sortByDueDate(readProjects());
		projectListEl.innerHTML = '';
		if (!projects.length) {
			projectListEl.innerHTML = '<p class="project-list__empty">No projects yet.</p>';
			return;
		}

		const ul = document.createElement('ul');
		projects.forEach(({ name, due, savedAt }) => {
			const li = document.createElement('li');
			li.dataset.id = String(savedAt || '');
			const title = name || 'Untitled';
			const dueText = due ? new Date(due).toLocaleDateString() : 'No due date';

			const info = document.createElement('div');
			info.className = 'project-list__info';

			const nameSpan = document.createElement('span');
			nameSpan.className = 'project-list__name';
			nameSpan.textContent = title;

			const dueSpan = document.createElement('span');
			dueSpan.className = 'project-list__due';
			dueSpan.textContent = dueText;

			info.appendChild(nameSpan);
			info.appendChild(dueSpan);

			const actions = document.createElement('div');
			actions.className = 'project-list__actions';
			actions.innerHTML = `
				<button class="project-btn project-btn--edit" aria-label="Edit project">Edit</button>
				<button class="project-btn project-btn--delete" aria-label="Delete project">Delete</button>
			`;

			li.appendChild(info);
			li.appendChild(actions);
			ul.appendChild(li);
		});
		projectListEl.appendChild(ul);
	};

	const deleteProject = (id) => {
		const projects = readProjects();
		const next = projects.filter((p) => String(p.savedAt || '') !== String(id));
		writeProjects(next);
		renderProjects();
	};

	const editProject = (id) => {
		const projects = readProjects();
		const idx = projects.findIndex((p) => String(p.savedAt || '') === String(id));
		if (idx === -1) return;
		const current = projects[idx];
		const newName = prompt('Update project name', current.name || '') ?? current.name;
		const newDue = prompt('Update due date (YYYY-MM-DD)', current.due || '') ?? current.due;
		projects[idx] = { ...current, name: (newName || '').trim(), due: (newDue || '').trim() };
		writeProjects(projects);
		renderProjects();
	};

	const writeProjects = (projects) => {
		localStorage.setItem('projects', JSON.stringify(projects));
	};

	const openPopup = () => {
		if (popup) popup.classList.add('open-popup');
	};

	const closePopup = () => {
		if (popup) popup.classList.remove('open-popup');
	};

	if (addBtn) {
		addBtn.addEventListener('click', (e) => {
			e.preventDefault();
			openPopup();
		});
	}

	if (cancelBtn) {
		cancelBtn.addEventListener('click', closePopup);
	}

	if (submitBtn) {
		submitBtn.addEventListener('click', (e) => {
			e.preventDefault();
			const name = projectInput ? projectInput.value.trim() : '';
			const due = dueDateInput ? dueDateInput.value : '';
			if (name || due) {
				const projects = readProjects();
				projects.push({ name, due, savedAt: Date.now() });
				writeProjects(projects);
				renderProjects();
			}
			closePopup();
		});
	}

	if (projectListEl) {
		projectListEl.addEventListener('click', (e) => {
			const target = e.target;
			if (!(target instanceof HTMLElement)) return;
			const li = target.closest('li');
			if (!li) return;
			const id = li.dataset.id;
			if (!id) return;
			if (target.classList.contains('project-btn--delete')) {
				const confirmDelete = confirm('Delete this project?');
				if (confirmDelete) deleteProject(id);
			}
			if (target.classList.contains('project-btn--edit')) {
				editProject(id);
			}
		});
	}

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closePopup();
		}
	});

	const now = new Date();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
	const myTime = `${hours}:${paddedMinutes}`;
	if (timeEl) {
		timeEl.textContent = myTime;
	}

	let greeting = 'Good night';
	if (hours >= 5 && hours < 12) {
		greeting = 'Good morning';
	} else if (hours >= 12 && hours < 18) {
		greeting = 'Good afternoon';
	} else {
		greeting = 'Good night';
	}
	if (greetingEl) {
		greetingEl.textContent = greeting;
	}

	if (projectInput || dueDateInput) {
		const projects = readProjects();
		const last = projects[projects.length - 1];
		if (last && projectInput) projectInput.value = last.name || '';
		if (last && dueDateInput) dueDateInput.value = last.due || '';
	}

	renderProjects();
	setRandomSearchPlaceholder();
});