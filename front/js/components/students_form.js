export default {
    props: ['students', 'currentStudentsIds', 'classId'],
    data: () => ({
        studentsIds: []
    }),
    methods: {
        set_students_internal(e) {
            this.studentsIds = Array.from(e.target.children)
                .filter(el => el.selected)
                .map(el => parseInt(el.value))
        },
        set_students() {
            this.$emit('set-students', {students: this.studentsIds, class_id: this.classId})
            this.$emit('close')
        },
    },
    template: `
        <form action="">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Выбор учеников</p>
                    <button
                        type="button"
                        class="delete"
                        @click="$emit('close')"/>
                </header>
                <section class="modal-card-body">
                    <div class="select is-multiple">
                        <select class="select" placeholder="Ученики" multiple @change="set_students_internal($event)">
                            <option v-for="student in students"
                                :value="student.id"
                                :key="student.id"
                                :selected="currentStudentsIds.includes(student.id)"
                            >{{ student.fio }}
                            </option>
                        </select>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <b-button
                        label="Отмена"
                        @click="$emit('close')" />
                    <b-button
                        label="Сохранить"
                        @click="set_students()"
                        type="is-primary" />
                </footer>
            </div>
        </form>
    `
}


