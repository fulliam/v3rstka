import Input from './input/index.vue';
import Toast from './toast/index.vue';
import { Button } from './button';
import Tooltip from './tooltip/index.vue';
import { Modal } from './modal';
import JsonView from './jsonview/index.vue';
import { Loader } from './loader';

export const Base = {
  Input,
  Toast,
  Button,
  Tooltip,
  Modal,
  JsonView,
  Loader
} as const;
