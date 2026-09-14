import { useModalContext } from "../Context/ModalContext";
import { useTaskContext } from "../Context/TaskContext";
import getPriorityBgColor from "../utils/getPriorityBgColor";

const EditCardModal = () => {
  const { selectedTask, setSelectedTask } = useTaskContext();
  const { setIsModalOpen } = useModalContext();
  const handleOutsideClick = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };
  return (
    <div
      className="modal-container flex flex-col justify-center items-center absolute top-0 left-0 w-full h-full p-[80px] bg-gray-950/70"
      onClick={handleOutsideClick}
    >
      <div className="edit-card bg-amber-200 rounded-xl">
        <span
          className={`priority px-3 py-1 rounded-full text-[8px] text-white font-bold w-fit uppercase tracking-wider ${getPriorityBgColor(selectedTask?.priority || "")}`}
        >
          {selectedTask?.priority}
        </span>
        <div className="title-description flex flex-col">
          <input type="text" value={selectedTask?.title} />
          <span>Description</span>
          <input type="text" value={selectedTask?.description} />
        </div>
        <div className="ticket-status">
          <div className="status">
            <span>Status</span>
            <span>{selectedTask?.status}</span>
          </div>
          <div className="due-date">
            <span>Due Date</span>
            <span>{selectedTask?.dueDate}</span>
          </div>
          <div className="asignee"></div>
        </div>
      </div>
    </div>
  );
};

export default EditCardModal;
