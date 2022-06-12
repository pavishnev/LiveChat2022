import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { AgentStatModel } from 'src/app/models/agent-stat.model';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  constructor(private statService: StatisticsService) {}

  private getChatsCountPerAgent$ = this.statService.getChatsCountPerAgent();
  private getAvgCountOfMessages$ = this.statService.getAvgCountOfMessages();
  private getAvgChatDuration$ = this.statService.getAvgChatDuration();
  private getMaxChatsDay$ = this.statService.getMaxChatsDay();

  public startDate = new FormControl(new Date(2020, 0, 1));
  public endDate = new FormControl(new Date(2030, 0, 1));
  public plots!: any;

  public chatsCountPerAgent!: AgentStatModel[];
  public avgCountOfMessages!: AgentStatModel[];
  public avgChatDuration!: AgentStatModel[];
  public maxChatsDay!: AgentStatModel[];

  ngOnInit() {
    //.subscribe((res)=>this.chatsCountPerAgent=res);
    combineLatest(
      this.getChatsCountPerAgent$,
      this.getAvgCountOfMessages$,
      this.getAvgChatDuration$,
      this.getMaxChatsDay$,
      (count, avgCount, avgDuration, maxChatsDay) => ({ count, avgCount, avgDuration, maxChatsDay })
    ).subscribe((pair) => {
      this.chatsCountPerAgent = pair.count;
      this.avgCountOfMessages = pair.avgCount;
      this.avgChatDuration = pair.avgDuration;
      this.maxChatsDay = pair.maxChatsDay;
      this.definePlots();
    });
  }

  definePlots() {
    this.plots = [
      {
        data: [
          {
            // values: [4, 10, 7],
            // labels: ['svitlana', 'regina', 'alexey'],
            labels: this.chatsCountPerAgent.map((p) => p.agentName),
            values: this.chatsCountPerAgent.map((p) => p.value),
            type: 'pie',
            marker: { color: 'red' },
          },
        ],
        layout: { width: 400, height: 400, title: 'Completed chats count' },
      },
      {
        data: [
          {
            x: this.avgCountOfMessages.map((p) => p.agentName),
            y: this.avgCountOfMessages.map((p) => p.value),
            type: 'bar',
            mode: 'lines+points',
            marker: {
              color: '#C8A2C8',
              line: {
                width: 2.5,
              },
            },
          },
        ],
        layout: {
          width: 500,
          height: 400,
          title: 'Average count of messages in chat',
        },
      },
      {
        data: [
          {
            x: this.avgChatDuration.map((p) => p.agentName),
            y: this.avgChatDuration.map((p) => p.value),
            type: 'bar',
            mode: 'lines+points',
            marker: {
              color: 'yellow',
              line: {
                width: 2.5,
              },
            },
          },
        ],
        layout: {
          width: 500,
          height: 400,
          title: 'Average chat duration (in minutes)',
        },
      },
      {
        data: [
          {
            x: this.maxChatsDay.map((p) => p.agentName),
            y: this.maxChatsDay.map((p) => p.value),
            type: 'scatter',
            mode: 'lines+points',
            marker: {
              color: 'blue',
              line: {
                width: 2.5,
              },
            },
          },
        ],
        layout: {
          width: 500,
          height: 400,
          title: 'Maximum chats completed a day',
        },
      },
    ];
  }
}
