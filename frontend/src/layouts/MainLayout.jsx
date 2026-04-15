import React from 'react'
import { Outlet } from 'react-router-dom'
import Layout from '../components/dashboard/Layout'
import { useAuth } from '../context/AuthContext'

const MainLayout = () => {
  const { user } = useAuth()

  return (
    <Layout user={user}>
      <Outlet />
    </Layout>
  )
}

export default MainLayout
