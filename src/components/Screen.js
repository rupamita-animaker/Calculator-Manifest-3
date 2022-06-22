
import styled from 'styled-components';

function Screen({
    value,
    handleInputChange
}) {
    const StyledScreen = styled.div`
    width: 90%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 40px;
    @media (max-width: 300px) {
        #input-expr {
            font-size: 30px;
        }
    }
    `;

    const StyledForm = styled.form`
    width: 100%;
    height: 60%;
    `;

    const InputExpr = styled.input`
    width: 100%;
    height: 100%;
    border: 2px rgba(42,42,33,255) solid;
    border-radius: 17px;
    text-align: right;
    background-color: rgba(190,190,163,255);
    padding: 20px;
    box-sizing: border-box;
    font-size: 50px;
    font-family: 'Big Shoulders Stencil Text', cursive;
    `;

    return (
        <StyledScreen>
            <StyledForm>
                <InputExpr id='input-expr' value={value} onChange={(event) => {
                handleInputChange(event.target.value);
                }}></InputExpr>
            </StyledForm>
        </StyledScreen>
    );
}

export default Screen;