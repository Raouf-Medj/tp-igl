import React from 'react'
import ProtectedComponent from '../../components/protected';


const ClientHome = () => {

    return (
        <ProtectedComponent role="CLIENT">
            <div>
                Hello world client!
            </div>
        </ProtectedComponent>
    )
}

export default ClientHome;