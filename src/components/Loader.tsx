import { ClipLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader size={30} color="black" />
    </div>
  )
}

export default Loader
