import { Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ padding: '5px' }}>

                <p className="intro">{`Quantidade: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};
export default CustomTooltip;

<Tooltip content={<CustomTooltip />} />