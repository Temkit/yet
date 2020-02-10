import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-questionnaire",
  templateUrl: "./questionnaire.component.html",
  styleUrls: ["./questionnaire.component.css"]
})
export class QuestionnaireComponent implements OnInit {
  @Output() patch: EventEmitter<object> = new EventEmitter<object>();

  objectConfig;
  objectValue;

  quiz;

  constructor(private fb: FormBuilder) {
    this.quiz = this.fb.group({
      questions: this.fb.array([])
    });
  }

  ngOnInit() {
    if (this.objectValue) {
      this.objectValue.map((question, i) => {
        this.quiz.get("questions").push(
          this.fb.group({
            multiple: question.multiple,
            required: question.required,
            question: question.question,
            reponses: this.fb.array([])
          })
        );

        question.reponses.map(reponse => {
          this.quiz
            .get("questions")
            .controls[i].get("reponses")
            .push(
              this.fb.group({
                reponse: reponse.reponse,
                correct: reponse.correct,
                note: reponse.note
              })
            );
        });
      });
    }

    this.quiz.valueChanges.subscribe(data => {
      this.patch.emit(data);
    });
  }

  addQuestion() {
    this.quiz.get("questions").push(
      this.fb.group({
        multiple: false,
        required: false,
        question: "",
        reponses: this.fb.array([
          this.fb.group({
            reponse: this.fb.control(" "),
            correct: this.fb.control(false),
            note: this.fb.control(0)
          })
        ])
      })
    );
  }

  addReponse(quesiton) {
    quesiton.get("reponses").push(
      this.fb.group({
        reponse: this.fb.control(" "),
        correct: this.fb.control(false),
        note: this.fb.control(0)
      })
    );
  }

  deletequestion(n) {
    this.quiz.get("questions").removeAt(n);
  }

  deleteresponse(question, r) {
    question.get("reponses").removeAt(r);
  }

  @Input()
  set config(val) {
    if (val) {
      this.objectConfig = val;
    }
  }

  @Input()
  set value(val) {
    if (val) {
      this.objectValue = JSON.parse(val);
    }
  }
}
