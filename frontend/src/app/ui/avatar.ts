import { Component, input, computed } from '@angular/core';
import { InitialsPipe } from '../shared/pipes/initials-pipe';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarColor = 'blue' | 'light-blue' | 'green';

@Component({
  selector: 'app-avatar',
  imports: [InitialsPipe],
  template: `
    <div [class]="containerClass()">
      {{ name() | initials }}
    </div>
  `,
})
export class AvatarComponent {
  name = input.required<string>();
  size = input<AvatarSize>('md');
  color = input<AvatarColor>('blue');

  containerClass = computed(() => {
    const sizes: Record<AvatarSize, string> = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-14 h-14 text-lg',
    };

    const colors: Record<AvatarColor, string> = {
      blue: 'bg-[#1B3A6B] text-white',
      'light-blue': 'bg-[#DBEAFE] text-[#1E40AF]',
      green: 'bg-[#D1FAE5] text-[#065F46]',
    };

    return `rounded-full flex items-center justify-center font-medium shrink-0 ${sizes[this.size()]} ${colors[this.color()]}`;
  });
}
