import styled from "styled-components";

function Keypad ({
    value,
    setValue,
    handleInputChange
}) {
    const digits = [];

    const StyledButton = styled.button`
    font-weight: bold;
    font-size: x-large;
    &:hover{
        opacity: 0.4;
    }
    &:active{
        opacity: 0.8;
    }
    `;

    const KeypadDiv = styled.div`
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px;
    align-items: center;
    width: 90%;
    height: 70%;
    `;

    const Operands = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
    height: 100%;
    `;

    const StyledDigits = styled.div`
    display: flex;
    flex-direction: column;
    height: 75%;
    `;

    const StyledDigitRow = styled.div`
    height: calc(100%/3);
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    `;
    
    const Digit = styled(StyledButton)`
    display: inline-block;
    width: 30%;
    height: 55%;
    background-color: rgba(122,121,122,255);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(253,253,252,255);
    border: 2px  rgba(136,140,139,255) solid;
    outline: 2px solid rgba(42,42,33,255);
    border-radius: 17px;
    @media (max-width: 300px) {
        outline: none;
        border: none;
        border-radius: 0px;
    }
    `;

    const BottomRow = styled.div`
    display: flex;
    height: 25%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    box-sizing: border-box;
    `;

    const BottomRowDiv = styled(StyledButton)`
    background-color: rgba(122,121,122,255);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(253,253,252,255);
    border: 2px  rgba(136,140,139,255) solid;
    outline: 2px solid rgba(42,42,33,255);
    border-radius: 17px;
    width: 30%;
    height: 55%;
    @media (max-width: 300px) {
        border: none;
        outline: none;
        border-radius: 0px;
    }
    `;

    const Operators = styled.div`
    display: flex;
    justify-content: space-around;
    width: 40%;
    height: 100%;
    `;

    const OperatorsCol = styled.div`
    display: flex;
    flex-direction: column;
    width: 40%;
    justify-content: space-around;
    align-items: center;
    `;

    const Operator = styled(StyledButton)`
    background-color: rgba(81,81,81,255);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(253,253,252,255);
    border: 2px  rgba(136,140,139,255) solid;
    outline: 2px solid rgba(42,42,33,255);
    border-radius: 17px;
    width: 70%;
    height: 15%;
    @media (max-width: 300px) {
        outline: none;
        border: none;
        border-radius: 0px;
      }
    `;

    const OperatorEquals = styled(Operator)`
    width: 70%;
    height: 41%;
    background-color: rgba(255,106,0,255);
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px  rgba(42,42,33,255) solid;
    border-radius: 17px;
    font-weight: bold;
    font-size: x-large;
    color: rgba(253,253,252,255);
    `;

    for(let i=9; i>0; i=i-3) {
        let digitRow = [];
        for(let j=(i-3+1); j<=i; j++) {
            digitRow.push(
                <Digit
                key={j} 
                onClick={() => {
                    handleInputChange(j.toString(), value);
                }}
                >
                    {j}
                </Digit>
            );
        }
        digits.push(
            <StyledDigitRow>
                {digitRow}
            </StyledDigitRow>
        );
    }

    return (
        <KeypadDiv>
            <Operands>
                <StyledDigits
                style={{width: '100%'}}>
                    {digits}
                </StyledDigits>
                <BottomRow
                style={{width: '100%'}}>
                    <div
                    style={{
                        width: '30%',
                        height: '55%'
                    }}
                    ></div>
                    <BottomRowDiv className="zero"
                    onClick={() => {
                        handleInputChange('0', value);
                    }}
                    >
                        0
                    </BottomRowDiv>
                    <BottomRowDiv className="decimal"
                    onClick={() => {
                        handleInputChange('.', value);
                    }}
                    >
                        .
                    </BottomRowDiv>
                </BottomRow>
            </Operands>
            <Operators>
                <OperatorsCol>
                    <Operator className="Operator plus"
                    onClick={() => {
                        handleInputChange('+', value);
                    }}
                    >
                        &#43;
                    </Operator>
                    <Operator className="Operator minus"
                    onClick={() => {
                        handleInputChange('-', value);
                    }}
                    >
                        &minus;
                    </Operator>
                    <Operator className="Operator prod"
                    onClick={() => {
                        handleInputChange('*', value);
                    }}
                    >
                        &times;
                    </Operator>
                    <Operator className="Operator div"
                    onClick={() => {
                        handleInputChange('/', value);
                    }}
                    >
                        &divide;
                    </Operator>
                </OperatorsCol>
                <OperatorsCol>
                    <Operator className="Operator percentage"
                    onClick={() => {
                        handleInputChange('%', value);
                    }}
                    >
                        &#37;
                    </Operator>
                    <Operator className="Operator clear-screen" onClick={() => {
                        setValue('');
                    }}>
                        AC
                    </Operator>
                    <OperatorEquals
                    onClick={() => {
                        handleInputChange('=', value);
                    }}
                    >
                        &#61;
                    </OperatorEquals>
                </OperatorsCol>
            </Operators>
        </KeypadDiv>
    );
}

export default Keypad;