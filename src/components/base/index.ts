import Input from './input/index.vue';
import Toast from './toast/index.vue';
import { Button } from './button';
import Tooltip from './tooltip/index.vue';
import Modal from './modal/index.vue';
import JsonView from './jsonview/index.vue';

export const Base = {
  Input,
  Toast,
  Button,
  Tooltip,
  Modal,
  JsonView,
} as const;
