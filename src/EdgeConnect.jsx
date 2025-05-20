import { useRef } from "react";
import useOutsideClick from "./hooks/useOutSideClick";


const modalStyle = {

    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0,0,0,0.2)',
    zIndex: 1000, // make sure it's above the canvas
};
function EdgeConnect({ onRelationSelect, onClose }) {

    const modalRef = useRef(null)
    useOutsideClick(modalRef, onClose)

    return (
        <>
            <div ref={modalRef} style={modalStyle}>
                <p>Select relationship type:</p>
                <select onChange={(e) => {

                    if (e.target.value) {
                        onRelationSelect(e.target.value)
                    }
                }}>
                    <option value="">--Select--</option>
                    <option value="PARENT_OF">Parent Of</option>
                    <option value="SPOUSE_OF">Spouse Of</option>
                </select>
            </div>
        </>
    )

}

export default EdgeConnect;
