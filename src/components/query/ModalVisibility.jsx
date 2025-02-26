import ModalBase from "../modal/ModalBase";
import BarChartCard from "../../partials/card/BarChartCard";
import LineChartCard from "../../partials/card/LineChartCard";
import DoughnutChartCard from "../../partials/card/DoughnutChartCard";

export default function ModalVisibility({ isOpen, onClose, title }) {
    if (!isOpen) return null;

    const randomCard = Math.floor(Math.random() * 3);

    let card;
    switch(randomCard) {
        case 0:
            card = <BarChartCard title={title} />;
            break;
        case 1:
            card = <LineChartCard title={title} />;
            break;
        case 2:
            card = <DoughnutChartCard title={title} />;
            break;
        default:
            card = <BarChartCard title={title} />;
    }

    return (
        <ModalBase title="Gráfica" onClose={onClose}>
            {card}
        </ModalBase>
    );
}
