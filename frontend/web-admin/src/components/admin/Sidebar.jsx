const Sidebar = ({ activeSection, setActiveSection }) => {
  const menus = [
    {
      key: 'dashboard',
      icon: 'fas fa-th-large',
      label: 'Dashboard',
    },
    {
      key: 'volunteers',
      icon: 'fas fa-users',
      label: 'Volunteers',
    },
    {
      key: 'disasters',
      icon: 'fas fa-fire',
      label: 'Disasters',
    },
    {
      key: 'shelters',
      icon: 'fas fa-home',
      label: 'Shelters',
    },
    {
      key: 'assignments',
      icon: 'fas fa-tasks',
      label: 'Assignments',
    },
  ]

  return (
    <div className='sidebar'>
      <div className='brand'>
        <i className='fas fa-hands-helping me-2'></i>
        DVN Admin
      </div>

      <nav className='mt-3'>
        {menus.map((menu) => (
          <button
            key={menu.key}
            className={`nav-link border-0 bg-transparent text-start w-100 ${
              activeSection === menu.key ? 'active' : ''
            }`}
            onClick={() => setActiveSection(menu.key)}
          >
            <i className={`${menu.icon} me-2`}></i>
            {menu.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar