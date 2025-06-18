import type { Ref } from 'vue';

interface ColorManagementProps {
  primaryColor: Ref<string>;
  secondaryColor: Ref<string>;
  currentPickerColor: Ref<string>;
  colorPalette: Ref<string[]>;
  showCustomColorPicker: Ref<boolean>;
  showMobileMenu: Ref<boolean>;
}

export function useColorManagement(props: ColorManagementProps) {
  function selectColor(color: string, target: 'primary' | 'secondary') {
    if (target === 'primary') {
      props.primaryColor.value = color;
      props.currentPickerColor.value = color;
    } else {
      props.secondaryColor.value = color;
    }
    props.showMobileMenu.value = false;
  }

  function clearPalette() {
    props.colorPalette.value = [];
  }

  function applyPickerColor() {
    props.primaryColor.value = props.currentPickerColor.value;
    props.showCustomColorPicker.value = false;
  }

  function addCurrentColorToPalette() {
    if (!props.colorPalette.value.includes(props.currentPickerColor.value)) {
      props.colorPalette.value.push(props.currentPickerColor.value);
    }
  }

  function swapColors() {
    const temp = props.primaryColor.value;
    props.primaryColor.value = props.secondaryColor.value;
    props.secondaryColor.value = temp;
  }

  return {
    selectColor,
    clearPalette,
    applyPickerColor,
    addCurrentColorToPalette,
    swapColors,
  };
}
