'use client';
import styles from './Modal.module.scss';
const Modal = (props: any) => {
	const { clickModal } = props;

  return (
    <>
		<div id="default-modal" 
		onClick={clickModal}
		tabIndex={-1} aria-hidden="true" className=
		{styles.modalBgStyle + " flex flex-col overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"}>
    	{props.children}
		</div>
    </>)
};

export default Modal;