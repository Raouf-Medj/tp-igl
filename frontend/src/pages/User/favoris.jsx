import React from 'react'
import ProtectedComponent from '../../components/protected';


const Favoris = () => {

    return (
        <ProtectedComponent role="CLIENT">
            <div>
                Page des favoris
            </div>
        </ProtectedComponent>
    )
}

export default Favoris;