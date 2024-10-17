'use client';

import Image from "next/image";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoDocumentOutline } from "react-icons/io5";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoDocumentTextOutline } from "react-icons/io5";

const SideBar = (props: any) => {

    return (
			<div className="absolute invisible mx-2 w-[230px] h-[500px]
			2xl:visible xl:visible lg:visible md:invisible sm:invisible mt-5 rounded-lg
			p-2 border-2 ">
				<div className="">
					<div className="h-[225px] p-1 border-b">
						<div className='ring-1 ring-gray-300 rounded-xl h-32 relative' >
							<Image 
							src=""
							quality={30}
							layout="fill"
							style={{ objectFit: "cover" , borderRadius: '8px' }}
							alt='' />
						</div>
						<div className="flex justify-between border-b">
							<p className="mt-1 truncate  ">wibterflower</p>
							<p className="mt-2 w-[10px]" ><IoDocumentTextOutline /></p>
						</div>
						<p className="mt-2 text-xs line-clamp-3">안녕하세요 하고하세요 하고 싶은말넣으세요안녕하세요 하고 싶은말넣으세요안녕하세요 하고 싶은말넣으세요</p>
					</div>
					
					<div>
						<p className="font-bold mt-1 border-b pb-1 mb-1">Categories</p>
						<div className="flex justify-start mt-1">
							<p className="text-base me-1"><IoDocumentsOutline /></p>
							<p className="text-sm font-bold truncate">대분류A</p>
						</div>
						<div className="flex justify-start text-sm mt-1">
							<p><PiLineVerticalThin /></p>
							<p className="text-base me-1 "><IoDocumentOutline /></p>
							<p className="text-sm truncate">소분류A</p>
						</div>
					</div>
				</div>
			</div>
    );

};
export default SideBar;