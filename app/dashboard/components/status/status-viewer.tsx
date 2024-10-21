import Image from "next/image";
import { formatTime } from "~/utils/format-date";
import back from '~/public/icons/backWhite.svg'
import x from '~/public/icons/xwhite.svg'
import chevron from '~/public/icons/chevron.svg'
import { useStatuses } from "~/app/context/status-context";
const StatusViewer = (props: any) => {
  const { isViewing, view, viewRef, toggleViewPopup, filterOwnedStatus } = props;
  const { selectedSenderStatuses,currentIndex, setCurrentIndex } = useStatuses();

  const activeStatuses = selectedSenderStatuses || filterOwnedStatus; 

  const handleStatusClick = (index: number) => {
    setCurrentIndex(index);
  };

  const nextStatus = () => {
    if (currentIndex < activeStatuses?.length - 1) {
      setCurrentIndex((prevIndex: any) => prevIndex + 1);
    } else {
      toggleViewPopup(); 
    }
  };

  const prevStatus = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex: any) => prevIndex - 1);
    } else {
      toggleViewPopup(); 
    }
  };

  return (
    view && (
      <button
        className={`fixed top-0 left-0 h-full w-full flex items-center justify-center outline-none cursor-default z-[60] ${
          isViewing ? "opacity-100" : "opacity-0"
        }`}
        onDoubleClick={nextStatus}
        ref={viewRef}
        style={{ backgroundColor: activeStatuses?.[currentIndex]?.background }}
      >
        <div className="h-full w-full flex items-center justify-center outline-none cursor-default relative">
          <div className="fixed top-5 left-5 z-[70] sm:hidden">
            <Image src={back} alt='' className="w-6" onClick={toggleViewPopup} />
          </div>

          <button className="absolute left-5 rotate-180 z-[70] sm:left-1" onClick={prevStatus}>
            <Image src={chevron} alt='' className="w-6" />
          </button>

          <button className="absolute right-5 z-[70] sm:right-1 " onClick={nextStatus}>
            <Image src={chevron} alt='' className="w-6" />
          </button>

          <div className="fixed top-5 right-5">
            <Image src={x} alt='' className="w-6" onClick={toggleViewPopup} />
          </div>

          {activeStatuses?.length > 0 ? (
            <button
              className="h-full w-[500px] flex items-center justify-center relative sm:w-full sm:mx-6"
              style={{ backgroundColor: activeStatuses?.[currentIndex]?.background }}
              key={activeStatuses?.[currentIndex]?._id}
            >
              <div className="flex items-center w-full flex-col gap-4 absolute top-4 sm:top-2">
                <div className="flex gap-2 w-full">
                  {activeStatuses?.map((_: any, index: any) => (
                    <button
                      key={index + 1}
                      onClick={() => handleStatusClick(index)} 
                      className={`w-full p-1 rounded-full ${
                        currentIndex === index ? " bg-white" : " bg-[#65676A]"
                      }`} 
                    />
                  ))}
                </div>
                
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center gap-3">
            <Image src={back} alt='' className="w-6 hidden sm:flex" onClick={toggleViewPopup} />
                    <img src={activeStatuses?.[currentIndex]?.sender?.profile || '/icons/default-user.svg'} alt='' className="w-12 h-12 object-cover rounded-full" />
                    <div className="flex items-start flex-col text-white">
                      <h1 className="text-base">{activeStatuses?.[currentIndex]?.sender?.username}</h1>
                      <h1 className="text-[13px]">{formatTime(activeStatuses?.[currentIndex]?.updatedAt)}</h1>
                    </div>
                  </div>
             
                </div>
              </div>

              <div className="opacity-100 duration-300 ease-in-out">
                <h4 className="text-6xl text-center text-white leading-normal lg:text-5xl lg:leading-none sm:text-4xl ">
                  {activeStatuses?.[currentIndex]?.content}
                </h4>
                
              </div>
            </button>
          ) : (
            <div>No statuses available</div>
          )}
        </div>
      </button>
    )
  );
};


export default StatusViewer;
