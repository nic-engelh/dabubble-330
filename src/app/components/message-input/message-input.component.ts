import { User } from './../../../models/user.class';
import { MessagingService } from './../../services/messaging-service/messaging.service';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Message } from '../../../models/message.class';
import { Conversation } from '../../../models/conversation.class';
import { MessageService } from '../../services/message-service/message.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent implements OnInit {
  threadId = '30040944-9e8d-4d01-a84b-a03c70ea58c7'; // Will be given
  chatForm: FormGroup;
  messages: string[] = [];
  // collection "threads"
  // subcollection: "messages"
  // path threads/30040944-9e8d-4d01-a84b-a03c70ea58c7/messages

  // form values = content and user
  formInputValues: any;
  user = new User(); //user wird übergeben
  // ACTIVE USER === SENDER
  constructor(
    private messageService: MessageService,
    private messagingService: MessagingService,
    private fb: FormBuilder
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  printConsoleLog() {
    console.log('hallo Input', this.formInputValues);
    // input === string;
  }

  // sendMessage() {
  //   if (this.chatForm.valid) {
  //     const newMessage = this.messageService.createMessage(
  //       this.threadId,
  //       this.formInputValues,
  //       this.user
  //     );

  //     this.messagingService.setMessagetoConversation(this.threadId, newMessage);
  //   }
  // }

  sendMessage() {
    if (this.chatForm.valid) {
      // Formularwert auslesen
      const messageContent = this.chatForm.get('message')?.value;

      // Erstelle die Nachricht mit dem MessageService
      const newMessage = this.messageService.createMessage(
        this.threadId, // ID des Gesprächs
        messageContent, // Der eigentliche Nachrichteninhalt (als string)
        this.user // Aktueller Benutzer, der die Nachricht sendet
      );

      // Nachricht zur Konversation hinzufügen
      this.messagingService
        .setMessagetoConversation(this.threadId, newMessage)
        .then(() => {
          console.log('Nachricht erfolgreich gesendet!');
          this.chatForm.reset(); // Formular nach erfolgreichem Absenden zurücksetzen
        })
        .catch((error) => {
          console.error('Fehler beim Senden der Nachricht:', error);
        });
    }
  }

  //function getUserSender(){}
  // function needs to find Sender from Conversation => active USER === Sender
}
