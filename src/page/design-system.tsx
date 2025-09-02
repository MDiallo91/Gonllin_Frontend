import  { RiUser2Fill, RiArrowLeftFill } from "react-icons/ri"
import Contenair from "../ui/component/contenair/Contenair"
import Avatar from "../ui/design_system/avatar/Avatar"
import Button from "../ui/design_system/button/button"
import Logo from "../ui/design_system/logo/Logo"
import Typography from "../ui/design_system/typography/typography"
import avatar from "../../public/svg/avatar.svg"
import Carousel from "../ui/component/caroussel/Caroussel"


function DesignSystem() {
  return (
      <>
      <Carousel/>
      <Contenair>


        <Button isLoading variant='outline' size='small'>accenter</Button>
        <Button isLoading variant='disabled' size='small' disabled>desabled</Button>
        <Button isLoading size='small'>Envoyer</Button>
        <Button isLoading variant='secondary' size='small'>accent</Button>
        <Button isLoading variant='icon' iconTheme='secondary' size='small' icon={{ icon: RiUser2Fill }} >accent</Button>

        <div className='space-x-5 p-2 gap-2'>
          <Button variant='outline' >accenter</Button>
          <Button variant='disabled' disabled>desabled</Button>
          <Button >Envoyer</Button>
          <Button variant='secondary' icon={{ icon: RiArrowLeftFill }}>accent</Button>
          <Button iconPosition='left' variant='secondary' icon={{ icon: RiArrowLeftFill }}>accent</Button>
          <Button variant='icon' icon={{ icon: RiUser2Fill }} >accent</Button>
          <Button variant='icon' iconTheme='gray' icon={{ icon: RiUser2Fill }} >accent</Button>
        </div>
        <div className='space-x-5 p-2 gap-2'>
          <Button variant='outline' size='large'>accenter</Button>
          <Button variant='disabled' size='large' disabled>desabled</Button>
          <Button size='large'>Envoyer</Button>
          <Button variant='secondary' size='large'>accent</Button>
          <Button variant='icon' size='large' icon={{ icon: RiUser2Fill }} >accent</Button>
          <Button variant='icon' iconTheme='secondary' size='large' icon={{ icon: RiUser2Fill }} >accent</Button>

        </div>
        <div className="flex gap-2 justify-center items-center bg-secondary-100">
          <Logo size='very-small' />
          <Logo size='small' />
          <Logo />
          <Logo size='large' />
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Avatar src='./public/svg/avatar.svg' alt='avattar' size='small' />
          <Avatar src={avatar} alt='avattar' />
          <Avatar src={avatar} alt='avattar' size='large' />
        </div>

        <div className='bg-bermuda'>bonjour</div>

        <Typography variant="body-base" weight='medium' component="div">conder Monkey</Typography>
        <Typography weight='regular' component="div">conder Monkey</Typography>
        <Typography variant="body-base" weight='regular' component="div" className='text-center'>Bonjour Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, eaque saepe consequatur sunt cumque corporis voluptatibus, voluptate hic debitis minus adipisci animi. Mollitia optio nam ut dolorem! Nulla, fugiat delectus.</Typography>
        <div className='bg-gray-100 text-secondary text-center'>Bonjour Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, eaque saepe consequatur sunt cumque corporis voluptatibus, voluptate hic debitis minus adipisci animi. Mollitia optio nam ut dolorem! Nulla, fugiat delectus.</div>
        <Typography variant="display" theme='black' weight='regular' component="p">conder de la Monkey</Typography>
        <Typography variant="h4" theme='secondary' weight='regular' component="div">conder Monkey</Typography>
      </Contenair>
    </>
  )
}

export default DesignSystem
