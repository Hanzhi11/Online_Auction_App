import { Ref, forwardRef } from 'react';
import { Option } from '../shared/Constants';

interface Props {
    options: Option[];
    selectedOptions: Option[];
    updateSelection: (data: Option[]) => void;
}

export default forwardRef<HTMLDivElement, Props>(function SubjectDropdown(
    props: Props,
    ref: Ref<HTMLDivElement>,
) {
    const { options, selectedOptions, updateSelection } = props;

    const handleOptionSelection = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;

        let liElement = target;

        if (target.tagName !== 'LI') {
            liElement = target.closest('li') as HTMLElement;
        }

        const subjectIndex =
            selectedOptions.length > 0
                ? selectedOptions.findIndex(
                      (item) => item.id.toString() === (liElement as HTMLLIElement).id,
                  )
                : -1;

        const newSubjects = [...selectedOptions];
        if (subjectIndex === -1) {
            const subject = options.find(
                (option) => option.id.toString() === (liElement as HTMLLIElement).id,
            ) as Option;
            newSubjects.push(subject);
        } else {
            newSubjects.splice(subjectIndex, 1);
        }
        updateSelection(newSubjects);
    };

    const isChecked = (option: Option) => {
        const subject =
            selectedOptions.length > 0
                ? selectedOptions.find((item) => item.id === option.id)
                : null;
        if (subject) {
            return true;
        }
        return false;
    };

    return (
        <div
            className='bg-white border rounded-md absolute top-[41px] w-full'
            ref={ref}
        >
            <ul>
                {options.map((option) => {
                    return (
                        <li
                            key={option.id}
                            id={option.id.toString()}
                            className='test'
                            onClick={handleOptionSelection}
                        >
                            <label
                                className='flex items-center px-3 py-1 cursor-pointer rounded-md hover:bg-green-500 hover:text-white group'
                                htmlFor={`checkbox${option.id}`}
                            >
                                <input
                                    readOnly
                                    name={`checkbox${option.id}`}
                                    type='checkbox'
                                    className='peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-0 ring-1 ring-offset-0 ring-gray-400 group-hover:ring-white checked:ring-green-500 checked:bg-green-500'
                                    checked={isChecked(option)}
                                />
                                <span className='ml-3'>{option.content}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
});
