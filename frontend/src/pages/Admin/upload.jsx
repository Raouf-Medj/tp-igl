import React from 'react'
import ProtectedComponent from '../../components/protected';


const AdminUpload = () => {

    return (
        <ProtectedComponent role="ADMIN">
            <div>
                upload article page!
            </div>
        </ProtectedComponent>
    )
}

export default AdminUpload;