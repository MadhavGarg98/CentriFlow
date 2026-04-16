import React, { useState, useRef, useEffect } from 'react'
import { FiSearch, FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi'
import styles from '../../styles/modules/PremiumNavbar.module.css'

const Navbar = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    // Handle logout logic here
    setIsDropdownOpen(false)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        {/* Search Bar */}
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.navbarRight}>
        {/* Notifications */}
        <button className={styles.notificationButton}>
          <FiBell className={styles.notificationIcon} />
          <span className={styles.notificationBadge}></span>
        </button>

        {/* Profile Dropdown */}
        <div className={styles.profileDropdown} ref={dropdownRef}>
          <button 
            className={styles.profileButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.profileAvatar}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>{user?.name}</div>
              <div className={styles.profileRole}>{user?.role}</div>
            </div>
          </button>

          {/* Dropdown Menu */}
          <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.open : ''}`}>
            <div className={styles.dropdownHeader}>
              <div className={styles.dropdownUser}>
                <div className={styles.dropdownAvatar}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className={styles.dropdownUserInfo}>
                  <div className={styles.dropdownName}>{user?.name}</div>
                  <div className={styles.dropdownEmail}>{user?.email}</div>
                </div>
              </div>
            </div>

            <div className={styles.dropdownItems}>
              <button className={styles.dropdownItem}>
                <FiUser className={styles.dropdownItemIcon} />
                <span className={styles.dropdownItemText}>Profile</span>
              </button>
              
              <button className={styles.dropdownItem}>
                <FiSettings className={styles.dropdownItemIcon} />
                <span className={styles.dropdownItemText}>Settings</span>
              </button>
              
              <div className={styles.dropdownDivider}></div>
              
              <button className={styles.dropdownItem} onClick={handleLogout}>
                <FiLogOut className={styles.dropdownItemIcon} />
                <span className={styles.dropdownItemText}>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
