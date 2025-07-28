import type { Participant } from "../../../pages/Checkout";
import styles from "./participantsList.module.css";

interface ParticipantsListProps {
  participants: Participant[];
  handleRemoveParticipant: (index: number) => void;
}

export default function ParticipantsList({
  participants,
  handleRemoveParticipant,
}: ParticipantsListProps) {
  return (
    <div className={styles.participantsList}>
      {participants.map((participant, index) => (
        <div key={index} className={styles.participantCard}>
          <div className={styles.participantInfo}>
            <span>{participant.name}</span>
            <span>{participant.ticketType === "all" ? "Inteira" : "Meia"}</span>
          </div>
          <button
            onClick={() => handleRemoveParticipant(index)}
            className={styles.removeButton}
          >
            Remover
          </button>
        </div>
      ))}
    </div>
  );
}
