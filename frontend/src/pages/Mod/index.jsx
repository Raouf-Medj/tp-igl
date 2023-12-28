import React from 'react'
import ProtectedComponent from '../../components/protected';


const ModHome = () => {

    return (
        <ProtectedComponent role="MOD">
            <div>
                Hello world mod!
            </div>
        </ProtectedComponent>
    )
}

export default ModHome;