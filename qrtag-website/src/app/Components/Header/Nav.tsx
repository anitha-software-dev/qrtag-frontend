import Link from 'next/link';
import DropDown from './DropDown';

export default function Nav({ setMobileToggle }) {
  return (
    <ul className="cs_nav_list fw-medium">
      <li>
        <Link href="/#about">About Us</Link>
      </li>
      <li>
        <Link href="/our-vision/#mission">Mission</Link>
      </li>
      <li>
        <Link href="/#features" onClick={() => setMobileToggle(false)}>
          Features
        </Link>
      </li>
      <li>
        <Link href="/team" onClick={() => setMobileToggle(false)}>
          Our Team
        </Link>
      </li>
      <li>
        <Link href="/blog" onClick={() => setMobileToggle(false)}>
          Blogs
        </Link>
      </li>
      <li>
        <Link href="/#how-it-works" onClick={() => setMobileToggle(false)}>
          How it Works
        </Link>
      </li>
      <li>
        <Link href="/#contact" onClick={() => setMobileToggle(false)}>
          Contact Us
        </Link>
      </li>
      <li>
        <Link href="/memorial-tags" onClick={() => setMobileToggle(false)}>
          Memorial Tags
        </Link>
      </li>
    </ul>
  );
}
