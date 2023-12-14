import React from 'react'
import ProtectedComponent from '../../components/protected';


const AdminHome = () => {

    return (
        <ProtectedComponent role="ADMIN">
            <div>
                Hello world admin!
            </div>
        </ProtectedComponent>
    )
}

export default AdminHome;